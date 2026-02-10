#!/bin/bash

INPUT_DIR="img/2024"
OUTPUT_DIR="img/2024/optimized"
SIZES=(600 1200 1920)
QUALITY=90

mkdir -p "$OUTPUT_DIR"

for file in "$INPUT_DIR"/*.{jpg,jpeg,png,JPG,JPEG,PNG}; do
  [ -f "$file" ] || continue
  filename=$(basename "$file")
  name="${filename%.*}"
  name=$(echo "$name" | tr '[:upper:]' '[:lower:]' | tr ' ' '_')

  for size in "${SIZES[@]}"; do
    echo "Processing $filename at ${size}px..."

    # Resize with sips (macOS built-in)
    sips -Z "$size" "$file" --out "/tmp/temp_resize.jpg" 2>/dev/null

    # Convert to WebP
    cwebp -q $QUALITY -m 6 "/tmp/temp_resize.jpg" -o "$OUTPUT_DIR/${name}-${size}.webp"

    # Also create optimized JPEG fallback
    sips -s format jpeg -s formatOptions $QUALITY "/tmp/temp_resize.jpg" --out "$OUTPUT_DIR/${name}-${size}.jpg" 2>/dev/null
  done
done

rm -f /tmp/temp_resize.jpg
echo "Done! Check $OUTPUT_DIR"
