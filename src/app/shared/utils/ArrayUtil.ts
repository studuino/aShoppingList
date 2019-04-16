export class ArrayUtil {

  /***
   * Reordering array according to:
   * Use splicing to reorder items (https://stackoverflow.com/questions/2440700/reordering-arrays/2440723)
   * @param positionChange from Ionic reordering groups ionChange event
   * @param array with items in original order
   */
  static reorderItemsInArray(positionChange, array) {
    const fromPosition = positionChange.from;
    const itemToMove = array.splice(fromPosition, 1)[0];
    const toPosition = positionChange.to;
    array.splice(toPosition, 0, itemToMove);
    return array;
  }
}
