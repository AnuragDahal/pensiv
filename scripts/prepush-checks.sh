# #!/bin/sh

# set -e

# # Store the root directory
# ROOT_DIR=$(pwd)

# echo "Starting pre-push checks from: $ROOT_DIR"

# # Function to safely change directory and run command
# run_in_directory() {
#     local dir=$1
#     local command=$2
#     local description=$3
    
#     if [ ! -d "$ROOT_DIR/$dir" ]; then
#         echo "Error: Directory '$dir' not found in $ROOT_DIR"
#         exit 1
#     fi
    
#     echo "Running $description in $dir..."
#     cd "$ROOT_DIR/$dir"
    
#     # Run the command and capture exit code
#     if eval "$command"; then
#         echo "$description passed!"
#         cd "$ROOT_DIR"
#     else
#         echo "$description FAILED!"
#         cd "$ROOT_DIR"
#         exit 1
#     fi
# }

# # Lint client and backend (this will fail due to your intentional error)
# run_in_directory "client" "pnpm lint" "Client lint"
# # run_in_directory "backend" "pnpm lint" "Backend lint"

# # Type check client and backend  
# run_in_directory "client" "pnpm tsc --noEmit" "Client type check"
# run_in_directory "backend" "pnpm tsc --noEmit" "Backend type check"

# # Build client
# run_in_directory "client" "pnpm build" "Client build"

# # Security audit
# run_in_directory "backend" "pnpm audit --audit-level=high" "Backend security audit"
# run_in_directory "client" "pnpm audit --audit-level=high" "Client security audit"

# # Format code
# # run_in_directory "client" "pnpm format" "Client formatting"
# # run_in_directory "backend" "pnpm format" "Backend formatting"

# echo "All pre-commit checks passed!"