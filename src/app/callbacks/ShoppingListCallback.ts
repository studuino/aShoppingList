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
   * Notify about location deleted
   */
  onLocationDeleted();

  /**
   * Notify listener of new list with uid
   */
  onListCreated(newListUid: string);
  /**
   * Notify listener that list is deleted
   */
  onListDeleted();

  /**
   * Notify listener that list is left
   */
  onListLeft(listUid: string, userUid: string);
}
