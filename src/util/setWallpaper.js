import { join } from 'path'
import appRootDir from 'app-root-dir'
import { execFile } from 'child_process'
import tmp from 'tmp'
import fs from 'fs'

export default function setWallpaper(imgData, filename) {
  const executablePath = (process.env.NODE_ENV === 'development')
    ? join(appRootDir.get(), 'bins', 'wallpaper')
    : join(process.resourcesPath, 'bins', 'wallpaper')

  const { name } = tmp.dirSync()
  const fullImgPath = name + '/' + filename;
  fs.writeFileSync(fullImgPath, imgData, { encoding: 'binary' })
  console.log('name', fullImgPath)
  execFile(executablePath, ['set',  fullImgPath], (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  })
}