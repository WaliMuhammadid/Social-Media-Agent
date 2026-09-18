from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "INFO"
    ENABLE_TELEMETRY: bool = False
    
    # API Keys
    ANTHROPIC_API_KEY: str = ""
    
    # Database
    MONGODB_URL: str = "mongodb://localhost:27017/social_agent"
    REDIS_URL: str = "redis://localhost:6379/0"
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

settings = Settings()
