
import io
import os
import random
import tempfile
from pathlib import Path

import numpy as np
import pandas as pd
import SimpleITK as sitk
from PIL import Image
from remotezip import RemoteZip

URL = (
    "https://zenodo.org/records/5548363/files/"
    "dataset_node21.zip?download=1"
)

METADATA_PATH = "cxr_images/proccessed_data/metadata.csv"
IMAGE_PREFIX = "cxr_images/proccessed_data/"

BASE_DIR = Path(__file__).resolve().parent
OUTPUT_DIR = BASE_DIR / "selected_images"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

TARGET_PER_CLASS = 5
random.seed(42)


def convert_mha_to_png(image_bytes, output_path):
    """Convert an MHA image to a viewable PNG file."""

    fd, temp_path = tempfile.mkstemp(suffix=".mha")

    try:
        # Write and close the temporary file before SimpleITK reads it.
        with os.fdopen(fd, "wb") as temp_file:
            temp_file.write(image_bytes)

        image = sitk.ReadImage(temp_path)
        array = sitk.GetArrayFromImage(image).squeeze()

        if array.ndim != 2:
            raise ValueError(
                f"Expected a 2D image, got shape {array.shape}"
            )

        # Scale image intensity for display.
        array = array.astype(np.float32)
        low, high = np.percentile(array, [1, 99])

        if high <= low:
            low = float(array.min())
            high = float(array.max())

        if high <= low:
            high = low + 1

        array = ((array - low) / (high - low) * 255)
        array = np.clip(array, 0, 255).astype(np.uint8)

        Image.fromarray(array).save(output_path, format="PNG")

    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)


def main():
    print("Connecting to NODE21...")
    print("Reading metadata remotely; no full archive download.")

    with RemoteZip(URL) as archive:
        metadata_bytes = archive.read(METADATA_PATH)
        metadata = pd.read_csv(io.BytesIO(metadata_bytes))

        required = {"img_name", "label"}
        if not required.issubset(metadata.columns):
            raise ValueError(
                f"Required columns {required} not found. "
                f"Available columns: {list(metadata.columns)}"
            )

        metadata["img_name"] = metadata["img_name"].astype(str)
        metadata["label"] = pd.to_numeric(
            metadata["label"], errors="coerce"
        )

        # A positive image has label 1; a negative image has label 0.
        positive = metadata.loc[
            metadata["label"] == 1, "img_name"
        ].drop_duplicates().tolist()

        negative = metadata.loc[
            metadata["label"] == 0, "img_name"
        ].drop_duplicates().tolist()

        random.shuffle(positive)
        random.shuffle(negative)

        print("Positive candidates:", len(positive))
        print("Negative candidates:", len(negative))

        # Use the archive's file index to locate the processed images.
        archive_names = set(archive.namelist())
        image_lookup = {}

        for name in archive_names:
            if name.startswith(IMAGE_PREFIX) and name.lower().endswith(".mha"):
                image_lookup[Path(name).name] = name

        print("Indexed processed MHA images:", len(image_lookup))

        saved = {1: 0, 0: 0}
        failed = {1: 0, 0: 0}

        for label, candidates in [(1, positive), (0, negative)]:
            print(
                "\nRetrieving",
                "positive" if label == 1 else "negative",
                "images..."
            )

            for filename in candidates:
                if saved[label] >= TARGET_PER_CLASS:
                    break

                archive_path = image_lookup.get(filename)

                if archive_path is None:
                    failed[label] += 1
                    continue

                output_path = OUTPUT_DIR / (
                    Path(filename).stem + ".png"
                )

                if output_path.exists():
                    print("Already exists:", output_path.name)
                    saved[label] += 1
                    continue

                try:
                    image_bytes = archive.read(archive_path)
                    convert_mha_to_png(image_bytes, output_path)

                    saved[label] += 1
                    print(
                        f"Saved {output_path.name} | "
                        f"dataset label={label}"
                    )

                except Exception as error:
                    failed[label] += 1
                    print(f"Skipped {filename}: {error}")

        print("\n========== SUMMARY ==========")
        print("Positive images saved:", saved[1])
        print("Negative images saved:", saved[0])
        print("Positive candidates skipped:", failed[1])
        print("Negative candidates skipped:", failed[0])
        print("Output folder:", OUTPUT_DIR.resolve())

        if saved[1] + saved[0] == 0:
            print(
                "\nNo images were saved. Please share this output "
                "so we can diagnose the issue."
            )
        else:
            print(
                "\nDone! Open the selected_images folder "
                "to view your PNG images."
            )


if __name__ == "__main__":
    try:
        main()
    except Exception as error:
        print("\nThe extraction process failed:")
        print(repr(error))
        print(
            "Your trained model and website files have not been changed."
        )
