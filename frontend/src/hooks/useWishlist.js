import { useState, useCallback } from "react";
import { wishlistAPI } from "../utils/api";

export function useWishlist(user, showToast) {
  const [wishlist, setWishlist] = useState([]);

  const toggleWishlist = useCallback(
    async (destId) => {
      const isIn = wishlist.includes(destId);
      setWishlist((w) =>
        isIn ? w.filter((x) => x !== destId) : [...w, destId]
      );

      if (user) {
        try {
          await wishlistAPI.toggle(destId);
        } catch {
          setWishlist((w) =>
            isIn ? [...w, destId] : w.filter((x) => x !== destId)
          );
          showToast("Failed to update wishlist", "error");
        }
      }
    },
    [wishlist, user, showToast]
  );

  const syncWishlist = useCallback(async () => {
    if (!user) return;
    try {
      const res = await wishlistAPI.get();
      const ids = res.data.data.map((d) => d._id);
      setWishlist(ids);
    } catch {
      // silently fail
    }
  }, [user]);

  return { wishlist, toggleWishlist, syncWishlist };
}