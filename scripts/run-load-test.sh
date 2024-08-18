#!/bin/bash

echo "Running Playwright setup..."
bun run setup-auth

# Check if Playwright setup run was successful
if [ $? -ne 0 ]; then
  echo "Playwright setup failed. Exiting..."
  exit 1
fi

echo "Playwright setup completed successfully. Moralis API token saved"

echo "Running K6 load test..."
bun run test-k6-load

# Check if K6 load test run was successful
if [ $? -ne 0 ]; then
  echo "K6 load test failed. Exiting..."
  exit 1
fi

echo "K6 load test completed successfully"
