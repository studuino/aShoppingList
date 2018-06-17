interface ShoppingListCallback {

  /**
   * Notify about user logout
   */
  onLogout();

  /**
   * Notify about location rename
   */
  onLocationRename(newTitle: string);

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
