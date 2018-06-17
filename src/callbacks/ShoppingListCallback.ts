interface ShoppingListCallback {

  /**
   * Notify about user logout
   */
  onLogout();

  /**
   * Notify about location rename
   * @param {string} newTitle
   */
  onLocationRename(newTitle: string);

  /**
   * Notify about location deleted
   */
  onLocationDeleted();

  /**
   * Notify listener of new list with uid
   * @param {string} newListUid
   */
  onListCreated(newListUid: string)
  /**
   * Notify listener that list is deleted
   */
  onListDeleted();

  /**
   * Notify listener that list is left
   * @param {string} listUid
   * @param {string} userUid
   */
  onListLeft(listUid: string, userUid: string)
}
