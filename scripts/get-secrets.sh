#!/bin/bash
set -euo pipefail

##############################################################################
# Script for pulling secret keys from GCP secret manager.
# Usage: ./bin/get-secrets.sh
##############################################################################

# Authenticate with Google Cloud
# gcloud auth login

# Set the project ID and the comma-separated list of secret IDs to retrieve
PROJECT_ID="mento-prod"
SECRET_IDS="coinmarketcap-key,etherscan-api,ethplorer-key,exchange-rate-api,sentry-dsn,ethereum-rpc-url,celo-node-rpc-url"

# Set the path to the .env file as the parent directory of the current directory
ENV_FILE="$(dirname -- "$0")/../.env.local"
printf "🌀 Updating env file: %s...\n" "${ENV_FILE}"

# Detect the OS (because the sed command is different for macOS and Linux)
if [[ ${OSTYPE} == "darwin"* ]]; then
	# macOS
	echo "Detected macOS"
	sed_inplace() { sed -i '' "$@"; }
elif [[ ${OSTYPE} == "linux-gnu"* ]]; then
	# Linux
	echo "Detected Linux"
	sed_inplace() { sed -i "$@"; }
else
	# Unsupported OS
	echo "Unsupported operating system: ${OSTYPE}"
	exit 1
fi

# Loop through the comma-separated list of secret IDs and retrieve the secret values
for SECRET_ID in $(echo "${SECRET_IDS}" | tr ',' ' '); do
	# Retrieve the secret value from Google Cloud
	SECRET_NAME="$(echo "${SECRET_ID}" | tr '-' '_' | tr '[:lower:]' '[:upper:]')"
	SECRET_VALUE="$(gcloud secrets versions access latest --secret="${SECRET_ID}" --project="${PROJECT_ID}")"

	# Write the secret value to the .env file
	# If the secret name already exists in the .env file, replace the value with the new value.
	if grep -q "^${SECRET_NAME}=" "${ENV_FILE}"; then
		# Use the appropriate sed command depending on the OS
		sed_inplace "s|^${SECRET_NAME}=.*|${SECRET_NAME}=${SECRET_VALUE}|g" "${ENV_FILE}"
	else
		# If the .env file is not empty, append the secret name and value to the .env file.
		if [[ -s ${ENV_FILE} ]]; then
			printf "\n%s=%s" "${SECRET_NAME}" "${SECRET_VALUE}" >>"${ENV_FILE}"
		else
			# If we don't have an .env, write the secret name and value to the .env file.
			echo -n "${SECRET_NAME}=${SECRET_VALUE}" >>"${ENV_FILE}"
		fi
	fi
	echo "Updated ${SECRET_NAME}"
done

printf "\n✅ All secrets have been updated in %s" "${ENV_FILE}"
