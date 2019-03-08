import GenerateFunction from '../../../src/commands/generate/function'
import { ensureBearerStructure } from '../../helpers/setup'
import { readFile } from '../../helpers/utils'
import { Authentications } from '@bearer/types/lib/authentications'

describe('Generate', () => {
  let bearerPath: string
  let result: string[]

  describe.each(Object.values(Authentications))(`%s - generate:function`, authType => {
    beforeAll(() => {
      result = []
      jest.spyOn(process.stdout, 'write').mockImplementation(val => result.push(val))
      bearerPath = ensureBearerStructure({ clean: true, authConfig: { authType }, folderName: authType })
    })

    it('Fetch function', async () => {
      await GenerateFunction.run(['FetchDataFunction', '-t', 'fetch', '--path', bearerPath])
      expect(result.join()).toContain('Function generated')
      expect(readFile(bearerPath, 'functions', 'FetchDataFunction.ts')).toMatchSnapshot()
    })

    it('Save function', async () => {
      await GenerateFunction.run(['SaveFunction', '-t', 'save', '--path', bearerPath])
      expect(result.join()).toContain('Function generated')
      expect(readFile(bearerPath, 'functions', 'SaveFunction.ts')).toMatchSnapshot()
    })
  })
})
