import glob
import re
import os

# Define paths
logic_dir = "apps/web/src/entities/visual-novel/scenarios"
public_dir = "apps/web/public"

# Pattern to find backgroundUrl (or defaultBackgroundUrl)
pattern = re.compile(r"[bB]ackgroundUrl:\s*['\"]([^'\"]+)['\"]")

# Find all logic files
logic_files = glob.glob(os.path.join(logic_dir, "**/*.logic.ts"), recursive=True)

missing_images = set()
found_images = set()

print(f"Scanning {len(logic_files)} logic files...")

for file_path in logic_files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
        matches = pattern.findall(content)
        for url in matches:
            # Construct full path
            full_path = os.path.join(public_dir, url.lstrip('/'))
            if not os.path.exists(full_path):
                missing_images.add(url)
                print(f"MISSING: {url} in {os.path.basename(file_path)}")
            else:
                found_images.add(url)

print("\nSummary:")
print(f"Found {len(found_images)} existing images.")
print(f"Found {len(missing_images)} MISSING images.")
for img in missing_images:
    print(f" - {img}")
