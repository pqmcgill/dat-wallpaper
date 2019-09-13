import { join } from 'path'
import appRootDir from 'app-root-dir'
import { execFile } from 'child_process'

export default function setWallpaper(wallpaperPath) {
  const executablePath = (process.env.NODE_ENV === 'development')
    ? join(appRootDir.get(), 'bins', 'wallpaper')
    : join(process.resourcesPath, 'bins', 'wallpaper')

  execFile(executablePath, ['set',  wallpaperPath], (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  })
}