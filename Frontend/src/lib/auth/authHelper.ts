import { browser } from "$app/environment";
import { goto } from "$app/navigation";
import { userStore } from "$lib/stores/userStore";

export function verifySignIn() {
  let userData: any = null;

  const unsubscribe = userStore.subscribe((value) => {
    userData = value;
    if (!userData && browser) {
      goto("/auth/v1.0");
    }
  });
  unsubscribe();
}
