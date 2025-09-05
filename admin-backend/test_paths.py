import os

# Get the parent directory (where frontend files are located)
FRONTEND_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Define directory paths for the new structure
PUBLIC_DIR = os.path.join(FRONTEND_DIR, 'public')
ADMIN_DIR = os.path.join(FRONTEND_DIR, 'admin')
SHARED_DIR = os.path.join(FRONTEND_DIR, 'shared')

print(f"FRONTEND_DIR: {FRONTEND_DIR}")
print(f"PUBLIC_DIR: {PUBLIC_DIR}")
print(f"ADMIN_DIR: {ADMIN_DIR}")
print(f"SHARED_DIR: {SHARED_DIR}")

print(f"\nPUBLIC_DIR exists: {os.path.exists(PUBLIC_DIR)}")
print(f"ADMIN_DIR exists: {os.path.exists(ADMIN_DIR)}")
print(f"SHARED_DIR exists: {os.path.exists(SHARED_DIR)}")

if os.path.exists(PUBLIC_DIR):
    print(f"\nFiles in PUBLIC_DIR:")
    for file in os.listdir(PUBLIC_DIR):
        print(f"  - {file}")

if os.path.exists(ADMIN_DIR):
    print(f"\nFiles in ADMIN_DIR:")
    for file in os.listdir(ADMIN_DIR):
        print(f"  - {file}")

if os.path.exists(SHARED_DIR):
    print(f"\nFiles in SHARED_DIR:")
    for file in os.listdir(SHARED_DIR):
        print(f"  - {file}")
