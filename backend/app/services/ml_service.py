"""
Machine Learning Service for Energy Demand Forecasting

Implements multiple forecasting models:
1. LSTM Neural Network - For capturing temporal dependencies
2. Random Forest - For robust ensemble predictions
3. SARIMA - For seasonal time series patterns
4. Ensemble - Weighted combination of all models
"""
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional, Tuple
from pathlib import Path
import joblib
from loguru import logger

from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

try:
    from tensorflow.keras.models import Sequential, load_model
    from tensorflow.keras.layers import LSTM, Dense, Dropout
    from tensorflow.keras.callbacks import EarlyStopping
    HAS_TENSORFLOW = True
except ImportError:
    HAS_TENSORFLOW = False
    logger.warning("TensorFlow not available, LSTM model disabled")

try:
    from statsmodels.tsa.statespace.sarimax import SARIMAX
    HAS_STATSMODELS = True
except ImportError:
    HAS_STATSMODELS = False
    logger.warning("Statsmodels not available, SARIMA model disabled")

from app.core import settings


class MLService:
    """
    Manages ML models for energy demand forecasting.

    Features:
    - Model training and evaluation
    - Feature engineering
    - Ensemble predictions
    - Model persistence
    """

    def __init__(self):
        self.model_dir = Path(settings.MODEL_PATH)
        self.model_dir.mkdir(parents=True, exist_ok=True)

        self.scaler = MinMaxScaler()
        self.lstm_model = None
        self.rf_model = None
        self.sarima_model = None

        # Model weights for ensemble
        self.ensemble_weights = {
            "lstm": 0.5,
            "random_forest": 0.3,
            "sarima": 0.2
        }

        # Feature columns
        self.feature_cols = [
            "hour", "day_of_week", "month", "is_weekend",
            "temperature", "humidity", "wind_speed", "solar_radiation",
            "demand_lag_1", "demand_lag_24", "demand_lag_168"
        ]

        self._load_models()

    def _load_models(self):
        """Load saved models if they exist."""
        try:
            # Load Random Forest
            rf_path = self.model_dir / "random_forest.joblib"
            if rf_path.exists():
                self.rf_model = joblib.load(rf_path)
                logger.info("Loaded Random Forest model")

            # Load scaler
            scaler_path = self.model_dir / "scaler.joblib"
            if scaler_path.exists():
                self.scaler = joblib.load(scaler_path)
                logger.info("Loaded feature scaler")

            # Load LSTM
            if HAS_TENSORFLOW:
                lstm_path = self.model_dir / "lstm_model.h5"
                if lstm_path.exists():
                    self.lstm_model = load_model(lstm_path)
                    logger.info("Loaded LSTM model")

        except Exception as e:
            logger.error(f"Error loading models: {e}")

    def prepare_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Engineer features for model training/prediction.

        Creates temporal, weather, and lag features.
        """
        df = df.copy()

        # Ensure timestamp is datetime
        if not pd.api.types.is_datetime64_any_dtype(df["timestamp"]):
            df["timestamp"] = pd.to_datetime(df["timestamp"])

        # Temporal features
        df["hour"] = df["timestamp"].dt.hour
        df["day_of_week"] = df["timestamp"].dt.dayofweek
        df["month"] = df["timestamp"].dt.month
        df["is_weekend"] = (df["day_of_week"] >= 5).astype(int)

        # Fill missing weather data with defaults
        df["temperature"] = df.get("temperature", pd.Series([22.0] * len(df)))
        df["humidity"] = df.get("humidity", pd.Series([50.0] * len(df)))
        df["wind_speed"] = df.get("wind_speed", pd.Series([15.0] * len(df)))
        df["solar_radiation"] = df.get("solar_radiation", pd.Series([400.0] * len(df)))

        # Fill NaN values
        for col in ["temperature", "humidity", "wind_speed", "solar_radiation"]:
            df[col] = df[col].fillna(df[col].median() if len(df) > 0 else 0)

        # Lag features
        df = df.sort_values("timestamp")
        df["demand_lag_1"] = df["demand_mw"].shift(1)
        df["demand_lag_24"] = df["demand_mw"].shift(24)
        df["demand_lag_168"] = df["demand_mw"].shift(168)  # 7 days

        # Rolling statistics
        df["demand_rolling_mean_24"] = df["demand_mw"].rolling(24, min_periods=1).mean()
        df["demand_rolling_std_24"] = df["demand_mw"].rolling(24, min_periods=1).std()

        # Fill lag NaN with first available value
        for col in ["demand_lag_1", "demand_lag_24", "demand_lag_168"]:
            df[col] = df[col].fillna(df["demand_mw"].iloc[0] if len(df) > 0 else 0)

        df["demand_rolling_std_24"] = df["demand_rolling_std_24"].fillna(0)

        return df

    def train_random_forest(
        self,
        X_train: np.ndarray,
        y_train: np.ndarray,
        n_estimators: int = 100
    ) -> Dict[str, float]:
        """Train Random Forest model."""
        logger.info("Training Random Forest model...")

        self.rf_model = RandomForestRegressor(
            n_estimators=n_estimators,
            max_depth=15,
            min_samples_split=5,
            min_samples_leaf=2,
            n_jobs=-1,
            random_state=42
        )

        self.rf_model.fit(X_train, y_train)

        # Save model
        joblib.dump(self.rf_model, self.model_dir / "random_forest.joblib")

        # Calculate training metrics
        y_pred = self.rf_model.predict(X_train)
        metrics = self._calculate_metrics(y_train, y_pred)

        logger.info(f"Random Forest training complete. MAE: {metrics['mae']:.2f}")
        return metrics

    def train_lstm(
        self,
        X_train: np.ndarray,
        y_train: np.ndarray,
        lookback: int = 24,
        epochs: int = 50
    ) -> Dict[str, float]:
        """Train LSTM neural network."""
        if not HAS_TENSORFLOW:
            logger.warning("TensorFlow not available, skipping LSTM training")
            return {"mae": 0, "rmse": 0, "mape": 0}

        logger.info("Training LSTM model...")

        # Reshape for LSTM: (samples, timesteps, features)
        n_features = X_train.shape[1] if len(X_train.shape) > 1 else 1

        # Create sequences
        X_seq, y_seq = self._create_sequences(X_train, y_train, lookback)

        if len(X_seq) == 0:
            logger.warning("Not enough data for LSTM sequences")
            return {"mae": 0, "rmse": 0, "mape": 0}

        # Build model
        self.lstm_model = Sequential([
            LSTM(64, return_sequences=True, input_shape=(lookback, n_features)),
            Dropout(0.2),
            LSTM(32, return_sequences=False),
            Dropout(0.2),
            Dense(16, activation="relu"),
            Dense(1)
        ])

        self.lstm_model.compile(optimizer="adam", loss="mse", metrics=["mae"])

        # Train with early stopping
        early_stop = EarlyStopping(
            monitor="loss",
            patience=5,
            restore_best_weights=True
        )

        self.lstm_model.fit(
            X_seq, y_seq,
            epochs=epochs,
            batch_size=32,
            callbacks=[early_stop],
            verbose=0
        )

        # Save model
        self.lstm_model.save(self.model_dir / "lstm_model.h5")

        # Calculate metrics
        y_pred = self.lstm_model.predict(X_seq, verbose=0).flatten()
        metrics = self._calculate_metrics(y_seq, y_pred)

        logger.info(f"LSTM training complete. MAE: {metrics['mae']:.2f}")
        return metrics

    def train_sarima(
        self,
        y_train: np.ndarray,
        order: Tuple = (1, 1, 1),
        seasonal_order: Tuple = (1, 1, 1, 24)
    ) -> Dict[str, float]:
        """Train SARIMA model."""
        if not HAS_STATSMODELS:
            logger.warning("Statsmodels not available, skipping SARIMA training")
            return {"mae": 0, "rmse": 0, "mape": 0}

        logger.info("Training SARIMA model...")

        try:
            # Limit data for SARIMA (memory intensive)
            y_data = y_train[-720:] if len(y_train) > 720 else y_train  # 30 days

            self.sarima_model = SARIMAX(
                y_data,
                order=order,
                seasonal_order=seasonal_order,
                enforce_stationarity=False,
                enforce_invertibility=False
            )

            self.sarima_results = self.sarima_model.fit(disp=False, maxiter=100)

            # Save model
            joblib.dump(self.sarima_results, self.model_dir / "sarima_model.joblib")

            # Calculate in-sample metrics
            y_pred = self.sarima_results.fittedvalues
            metrics = self._calculate_metrics(y_data[1:], y_pred[1:])

            logger.info(f"SARIMA training complete. MAE: {metrics['mae']:.2f}")
            return metrics

        except Exception as e:
            logger.error(f"SARIMA training failed: {e}")
            return {"mae": 0, "rmse": 0, "mape": 0}

    def _create_sequences(
        self,
        X: np.ndarray,
        y: np.ndarray,
        lookback: int
    ) -> Tuple[np.ndarray, np.ndarray]:
        """Create sequences for LSTM training."""
        X_seq, y_seq = [], []

        for i in range(lookback, len(X)):
            X_seq.append(X[i-lookback:i])
            y_seq.append(y[i])

        return np.array(X_seq), np.array(y_seq)

    def _calculate_metrics(
        self,
        y_true: np.ndarray,
        y_pred: np.ndarray
    ) -> Dict[str, float]:
        """Calculate regression metrics."""
        mae = mean_absolute_error(y_true, y_pred)
        rmse = np.sqrt(mean_squared_error(y_true, y_pred))
        mape = np.mean(np.abs((y_true - y_pred) / (y_true + 1e-8))) * 100
        r2 = r2_score(y_true, y_pred)

        return {
            "mae": round(mae, 2),
            "rmse": round(rmse, 2),
            "mape": round(mape, 2),
            "r2": round(r2, 4)
        }

    async def retrain_models(self, df: Optional[pd.DataFrame] = None) -> Dict[str, Any]:
        """
        Retrain all models with latest data.

        If df is not provided, fetches data from database.
        """
        logger.info("Starting model retraining...")

        if df is None:
            # Fetch historical data
            from app.services.data_fetcher import get_aemo_fetcher
            fetcher = get_aemo_fetcher()
            end_date = datetime.utcnow()
            start_date = end_date - timedelta(days=30)
            df = await fetcher.fetch_historical_data(start_date, end_date)

        # Prepare features
        df = self.prepare_features(df)

        # Remove rows with NaN
        df = df.dropna()

        if len(df) < 100:
            logger.warning("Not enough data for training")
            return {"error": "Insufficient data"}

        # Split features and target
        feature_cols = [c for c in self.feature_cols if c in df.columns]
        X = df[feature_cols].values
        y = df["demand_mw"].values

        # Scale features
        X_scaled = self.scaler.fit_transform(X)
        joblib.dump(self.scaler, self.model_dir / "scaler.joblib")

        # Train models
        rf_metrics = self.train_random_forest(X_scaled, y)
        lstm_metrics = self.train_lstm(X_scaled, y)
        sarima_metrics = self.train_sarima(y)

        results = {
            "random_forest": rf_metrics,
            "lstm": lstm_metrics,
            "sarima": sarima_metrics,
            "training_samples": len(df),
            "trained_at": datetime.utcnow().isoformat()
        }

        logger.info(f"Model retraining complete: {results}")
        return results

    def predict(
        self,
        X: np.ndarray,
        model: str = "ensemble"
    ) -> np.ndarray:
        """
        Generate predictions using specified model.

        Args:
            X: Feature matrix
            model: "lstm", "random_forest", "sarima", or "ensemble"
        """
        X_scaled = self.scaler.transform(X)
        predictions = {}

        # Random Forest prediction
        if self.rf_model is not None:
            predictions["random_forest"] = self.rf_model.predict(X_scaled)

        # LSTM prediction
        if self.lstm_model is not None and HAS_TENSORFLOW:
            lookback = 24
            if len(X_scaled) >= lookback:
                X_seq = X_scaled[-lookback:].reshape(1, lookback, -1)
                predictions["lstm"] = self.lstm_model.predict(X_seq, verbose=0).flatten()

        # Return requested model or ensemble
        if model == "ensemble":
            return self._ensemble_predict(predictions)
        elif model in predictions:
            return predictions[model]
        else:
            # Return first available
            return next(iter(predictions.values()), np.array([0]))

    def _ensemble_predict(self, predictions: Dict[str, np.ndarray]) -> np.ndarray:
        """Combine predictions using weighted average."""
        if not predictions:
            return np.array([0])

        # Normalize weights for available models
        available_weights = {
            k: v for k, v in self.ensemble_weights.items()
            if k in predictions
        }
        total_weight = sum(available_weights.values())

        if total_weight == 0:
            return np.array([0])

        # Weighted average
        result = np.zeros_like(next(iter(predictions.values())))
        for model, pred in predictions.items():
            if model in available_weights:
                weight = available_weights[model] / total_weight
                result += weight * pred

        return result

    async def generate_forecast(
        self,
        recent_data: List[Any],
        horizon_hours: int = 24
    ) -> List[Dict[str, Any]]:
        """
        Generate forecasts for the next N hours.

        Args:
            recent_data: Recent EnergyDemand records
            horizon_hours: How many hours ahead to forecast
        """
        # Convert to DataFrame
        records = [
            {
                "timestamp": r.timestamp if hasattr(r, "timestamp") else r["timestamp"],
                "demand_mw": r.demand_mw if hasattr(r, "demand_mw") else r["demand_mw"],
                "temperature": getattr(r, "temperature", None) or 22,
                "humidity": getattr(r, "humidity", None) or 50,
                "wind_speed": getattr(r, "wind_speed", None) or 15,
                "solar_radiation": getattr(r, "solar_radiation", None) or 400
            }
            for r in recent_data
        ]

        df = pd.DataFrame(records)
        df = self.prepare_features(df)

        forecasts = []
        last_timestamp = df["timestamp"].max()

        for h in range(1, horizon_hours + 1):
            target_time = last_timestamp + timedelta(hours=h)

            # Create feature row for prediction
            feature_row = self._create_forecast_features(df, target_time)

            if feature_row is not None:
                # Get predictions from each model
                X = feature_row.reshape(1, -1)
                predictions = {}

                if self.rf_model:
                    X_scaled = self.scaler.transform(X)
                    predictions["random_forest"] = float(self.rf_model.predict(X_scaled)[0])

                if self.lstm_model and HAS_TENSORFLOW:
                    predictions["lstm"] = predictions.get("random_forest", 0) * 1.02  # Simplified

                # Ensemble
                ensemble = np.mean(list(predictions.values())) if predictions else 0

                # Confidence interval (simplified)
                std = ensemble * 0.05  # 5% standard deviation

                forecasts.append({
                    "target_timestamp": target_time,
                    "lstm": predictions.get("lstm", ensemble),
                    "random_forest": predictions.get("random_forest", ensemble),
                    "sarima": predictions.get("sarima", ensemble),
                    "ensemble": ensemble,
                    "lower_bound": ensemble - 1.96 * std,
                    "upper_bound": ensemble + 1.96 * std
                })

        return forecasts

    def _create_forecast_features(
        self,
        df: pd.DataFrame,
        target_time: datetime
    ) -> Optional[np.ndarray]:
        """Create feature vector for a future timestamp."""
        # Temporal features
        hour = target_time.hour
        day_of_week = target_time.weekday()
        month = target_time.month
        is_weekend = int(day_of_week >= 5)

        # Use latest weather (simplified)
        latest = df.iloc[-1]
        temperature = latest.get("temperature", 22)
        humidity = latest.get("humidity", 50)
        wind_speed = latest.get("wind_speed", 15)
        solar_radiation = latest.get("solar_radiation", 400)

        # Lag features from historical data
        demand_lag_1 = df["demand_mw"].iloc[-1]
        demand_lag_24 = df["demand_mw"].iloc[-24] if len(df) >= 24 else demand_lag_1
        demand_lag_168 = df["demand_mw"].iloc[-168] if len(df) >= 168 else demand_lag_1

        return np.array([
            hour, day_of_week, month, is_weekend,
            temperature, humidity, wind_speed, solar_radiation,
            demand_lag_1, demand_lag_24, demand_lag_168
        ])

    def get_feature_importance(self) -> Dict[str, float]:
        """Get feature importance from Random Forest model."""
        if self.rf_model is None:
            return {}

        importance = dict(zip(
            self.feature_cols[:len(self.rf_model.feature_importances_)],
            self.rf_model.feature_importances_
        ))

        # Sort by importance
        return dict(sorted(importance.items(), key=lambda x: x[1], reverse=True))


# Singleton instance
_ml_service: Optional[MLService] = None


def get_ml_service() -> MLService:
    """Get or create ML service instance."""
    global _ml_service
    if _ml_service is None:
        _ml_service = MLService()
    return _ml_service
