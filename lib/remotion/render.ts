import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import os from "os";

export interface RenderOptions {
  compositionId: string;
  props: Record<string, any>;
  outputPath?: string;
}

export interface RenderResult {
  success: boolean;
  outputPath?: string;
  error?: string;
}

export async function renderVideo(options: RenderOptions): Promise<RenderResult> {
  const { compositionId, props } = options;

  // Create temp output path
  const tempDir = os.tmpdir();
  const timestamp = Date.now();
  const outputPath = options.outputPath || path.join(tempDir, `${timestamp}-${compositionId}.mp4`);

  // Write props to a temp JSON file (Windows-friendly approach)
  const propsFilePath = path.join(tempDir, `${timestamp}-props.json`);
  fs.writeFileSync(propsFilePath, JSON.stringify(props));

  return new Promise((resolve) => {
    const args = [
      "remotion",
      "render",
      compositionId,
      outputPath,
      `--props=${propsFilePath}`,
    ];

    console.log(`Starting render: npx ${args.join(" ")}`);

    const renderProcess = spawn("npx", args, {
      cwd: path.resolve("."),
      shell: true,
      env: { ...global.process.env },
    });

    let stdout = "";
    let stderr = "";

    renderProcess.stdout?.on("data", (data) => {
      stdout += data.toString();
      console.log(`[Remotion] ${data.toString()}`);
    });

    renderProcess.stderr?.on("data", (data) => {
      stderr += data.toString();
      console.error(`[Remotion] ${data.toString()}`);
    });

    renderProcess.on("close", (code) => {
      // Cleanup props file
      try {
        if (fs.existsSync(propsFilePath)) {
          fs.unlinkSync(propsFilePath);
        }
      } catch (e) {
        console.error("Failed to cleanup props file:", e);
      }

      if (code === 0 && fs.existsSync(outputPath)) {
        resolve({
          success: true,
          outputPath,
        });
      } else {
        resolve({
          success: false,
          error: stderr || `Render failed with code ${code}`,
        });
      }
    });

    renderProcess.on("error", (err) => {
      // Cleanup props file
      try {
        if (fs.existsSync(propsFilePath)) {
          fs.unlinkSync(propsFilePath);
        }
      } catch (e) {
        console.error("Failed to cleanup props file:", e);
      }

      resolve({
        success: false,
        error: err.message,
      });
    });
  });
}

export async function cleanupRender(outputPath: string): Promise<void> {
  try {
    if (fs.existsSync(outputPath)) {
      fs.unlinkSync(outputPath);
    }
  } catch (e) {
    console.error("Failed to cleanup render:", e);
  }
}
