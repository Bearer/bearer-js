export enum FunctionType {
  /**
   * Simple func (function) to fetch data (get/post/put) from
   * You can store data within the func itself or query external APIs
   */
  FetchData = 'FetchData',
  /**
   * Lets you store data easily data to the Bearer database
   */
  SaveState = 'SaveState'
}

export default FunctionType
