# main.tf - Configuration complète corrigée
terraform {
  required_version = ">= 1.0"
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
  }
}

provider "azurerm" {
  features {}
}

# Resource Group
resource "azurerm_resource_group" "main" {
  name     = "rg-trapurcrap-prod-v4"
  location = "France Central"

  tags = {
    Environment = "production"
    Project     = "TrapUrCrap"
  }
}

# Container Registry
resource "azurerm_container_registry" "acr" {
  name                = "acrtrapurcrapv4"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = "Basic"
  admin_enabled       = true

  tags = {
    Environment = "production"
    Project     = "TrapUrCrap"
  }
}

# Cosmos DB Account (MongoDB API)
resource "azurerm_cosmosdb_account" "mongodb" {
  name                = "cosmos-trapurcrap-v2"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  offer_type          = "Standard"
  kind                = "MongoDB"

  automatic_failover_enabled = false

  consistency_policy {
    consistency_level = "Session"
  }

  geo_location {
    location          = azurerm_resource_group.main.location
    failover_priority = 0
  }

  capabilities {
    name = "EnableMongo"
  }

  capabilities {
    name = "DisableRateLimitingResponses"
  }

  tags = {
    Environment = "production"
    Project     = "TrapUrCrap"
  }
}

# Cosmos DB Database
resource "azurerm_cosmosdb_mongo_database" "main" {
  name                = "trapurcrap"
  resource_group_name = azurerm_resource_group.main.name
  account_name        = azurerm_cosmosdb_account.mongodb.name
}

# Backend Container Instance
resource "azurerm_container_group" "backend" {
  name                = "trapurcrap-backend"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  ip_address_type     = "Public"
  dns_name_label      = "trapurcrap-backend"
  os_type             = "Linux"

  image_registry_credential {
    server   = azurerm_container_registry.acr.login_server
    username = azurerm_container_registry.acr.admin_username
    password = azurerm_container_registry.acr.admin_password
  }

  container {
    name   = "backend"
    image  = "${azurerm_container_registry.acr.login_server}/trapurcrap-backend:latest"
    cpu    = "1"
    memory = "1.5"

    ports {
      port     = 5000
      protocol = "TCP"
    }

    environment_variables = {
      NODE_ENV     = "production"
      PORT         = "5000"
      FRONTEND_URL = "http://trapurcrap-frontend.francecentral.azurecontainer.io:8080"
    }

    secure_environment_variables = {
      MONGO_URI         = azurerm_cosmosdb_account.mongodb.primary_mongodb_connection_string
      JWT_SECRET        = "43a4176bc587dd7f43fb559e68c54457f4e3752df30ce6365fba0e46956f99cc"
      JWT_EXPIRATION    = "7d"
      SALT_ROUNDS       = "10"
      STRIPE_SECRET_KEY = "sk_test_fake_key_for_testing_only"
      SMTP_HOST         = "smtp.gmail.com"
      SMTP_PORT         = "465"
      SMTP_SECURE       = "true"
      SMTP_USER         = "trapurcrap@gmail.com"
      SMTP_PASS         = "koyb gfyr vbbg kywr"
    }
  }

  tags = {
    Environment = "production"
    Project     = "TrapUrCrap"
    Service     = "Backend"
  }
}

# Frontend Container Instance
resource "azurerm_container_group" "frontend" {
  name                = "trapurcrap-frontend"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  ip_address_type     = "Public"
  dns_name_label      = "trapurcrap-frontend"
  os_type             = "Linux"

  image_registry_credential {
    server   = azurerm_container_registry.acr.login_server
    username = azurerm_container_registry.acr.admin_username
    password = azurerm_container_registry.acr.admin_password
  }

  container {
    name   = "frontend"
    image  = "${azurerm_container_registry.acr.login_server}/trapurcrap-frontend:latest"
    cpu    = "0.5"
    memory = "1"

    ports {
      port     = 8080
      protocol = "TCP"
    }

    environment_variables = {
      VITE_API_URL = "http://trapurcrap-backend.francecentral.azurecontainer.io:5000/api"
    }

  }

  tags = {
    Environment = "production"
    Project     = "TrapUrCrap"
    Service     = "Frontend"
  }

  depends_on = [azurerm_container_group.backend]
}

# Outputs

output "acr_login_server" {
  description = "The login server for the Azure Container Registry"
  value       = azurerm_container_registry.acr.login_server
}

output "frontend_url" {
  value = "http://trapurcrap-frontend.francecentral.azurecontainer.io:8080"
}

output "backend_url" {
  value = "http://trapurcrap-backend.francecentral.azurecontainer.io:5000"
}

output "backend_health_check" {
  value = "http://trapurcrap-backend.francecentral.azurecontainer.io:5000/health"
}

output "mongodb_connection_string" {
  value     = azurerm_cosmosdb_account.mongodb.primary_mongodb_connection_string
  sensitive = true
}