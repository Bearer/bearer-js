import Transpiler, { TranpilerOptions } from '../../src/index'

export function TranspilerFactory(options: Partial<TranpilerOptions>): Transpiler {
  const defaults: TranpilerOptions = {
    verbose: false,
    watchFiles: false,
    tagNamePrefix: 'kikoo-lol-files',
    buildFolder: '../../../.build/'
  }

  return new Transpiler({
    ...defaults,
    ...options
  })
}
