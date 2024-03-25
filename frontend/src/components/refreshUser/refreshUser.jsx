export function checkUserIdAndReload(userId) {
    if (userId === undefined) {
      window.location.reload();
    }
  }
