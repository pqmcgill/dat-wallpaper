import assert from 'assert'
import path from 'path'
import mirror from 'mirror-folder'
import datIgnore from 'dat-ignore'
import speed from 'speedometer'
import setDebug from 'debug'

const debug = setDebug('dat-wallpaper')

export default function importFiles(archive, src, opts, cb) {
  // if (!archive.writable) throw new Error('Must be archive owner to import files.')
  if (typeof src !== 'string') return importFiles(archive, '', src, opts)
  if (typeof opts === 'function') return importFiles(archive, src, {}, opts)

  src = src && src.length ? src : '/'
  opts = Object.assign({
    indexing: (opts && opts.indexing)
  }, opts)

  const imp = importer(archive, src, opts, cb)
  return imp
}

export function importer (archive, src, opts, cb) {
  debugger;
  assert.ok(archive, 'lib/import-files archive required')
  assert.ok(src, 'lib/import-files src directory required')
  if (typeof opts === 'function') return importer(archive, src, {}, opts)

  var progress
  var importCount
  var indexSpeed = speed()
  var ignore = datIgnore(src, opts)
  var ignoreDirs = !(opts.ignoreDirs === false)
  src = path.normalize(src)

  opts = Object.assign({
    watch: false,
    dereference: true,
    count: true
  }, opts, {
    // overwrite opts.ignore (original opts.ignore parsed in dat-ignore)
    ignore: function (name, st) {
      if (ignoreDirs && st && st.isDirectory()) return true
      return ignore(name, st)
    }
  })
  debug('importFiles()', opts)

  if (opts.count) {
    // Dry Run Import to get initial import size
    importCount = { files: 0, bytes: 0 }
    var dryRunOpts = Object.assign({}, opts, { dryRun: true, watch: false }) // force right side opts
    var dryRun = mirror(src, { name: '/', fs: archive }, dryRunOpts, function (err) {
      if (err) return cb(err)
      progress.emit('count', importCount)
    })
    dryRun.on('put', function (src, dst) {
      if (src.stat.isDirectory() || src.live) return
      importCount.bytes += src.stat.size
      importCount.files++
    })
  }

  // Importing
  progress = mirror(src, { name: '/', fs: archive }, opts, cb)
  progress.on('put-data', function (chunk, src, dst) {
    progress.indexSpeed = indexSpeed(chunk.length)
  })
  if (debug.enabled) {
    progress.on('put', function (src, dst) {
      debug('IMPORT put:', dst.name)
    })
    progress.on('del', function (src, dst) {
      debug('IMPORT del:', dst.name)
    })
    progress.on('ignore', function (src, dst) {
      debug('IMPORT ignore:', dst.name)
    })
    progress.on('skip', function (src, dst) {
      debug('IMPORT skip:', dst.name)
    })
    progress.on('end', function () {
      debug('IMPORT done')
    })
  }
  if (opts.count) {
    progress.count = importCount
    progress.putDone = {
      files: 0,
      bytes: 0
    }
    progress.on('put-end', function (src, dst) {
      if (!src.live) {
        progress.putDone.bytes += src.stat.size
        progress.putDone.files++
      }
    })
  }

  progress.options = opts
  return progress
}