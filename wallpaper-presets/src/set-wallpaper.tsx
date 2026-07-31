import { Action, ActionPanel, Grid, showHUD, closeMainWindow } from "@raycast/api";
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import os from "os";

// Carpeta donde guardas tus wallpapers. Cámbiala si usas otra ruta.
const WALLPAPER_DIR = path.join(os.homedir(), ".config/desktop-presets/wallpapers");

function setWallpaper(filePath: string) {
  const script = `
tell application "System Events"
  tell every desktop
    set picture to "${filePath}"
  end tell
end tell`;
  execSync("osascript", { input: script });
}

export default function Command() {
  let files: string[] = [];
  try {
    files = fs
      .readdirSync(WALLPAPER_DIR)
      .filter((f) => /\.(jpg|jpeg|png|heic|webp)$/i.test(f));
  } catch {
    files = [];
  }

  if (files.length === 0) {
    return (
      <Grid columns={4}>
        <Grid.EmptyView
          title="No hay wallpapers"
          description={`Pon tus imágenes en ${WALLPAPER_DIR}`}
        />
      </Grid>
    );
  }

  return (
    <Grid columns={4} inset={Grid.Inset.Small}>
      {files.map((file) => {
        const fullPath = path.join(WALLPAPER_DIR, file);
        return (
          <Grid.Item
            key={file}
            content={{ source: fullPath }}
            title={file.replace(/\.[^.]+$/, "")}
            actions={
              <ActionPanel>
                <Action
                  title="Poner como Wallpaper"
                  onAction={async () => {
                    setWallpaper(fullPath);
                    await closeMainWindow();
                    await showHUD(`Wallpaper: ${file}`);
                  }}
                />
              </ActionPanel>
            }
          />
        );
      })}
    </Grid>
  );
}
