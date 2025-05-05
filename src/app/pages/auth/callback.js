// pages/auth/callback.js
import { useEffect } from "react";
import { useRouter } from "next/router";
import { supabase } from "../../utils/supabaseClient";
import * as model from "../../utils/model.js";
import { AJAX } from "../../utils/helpers.js";
import { API_URL } from "../../utils/config.js";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    async function finishAuth() {
      // 1) grab the JWT from the URL
      const { data, error } = await supabase.auth.getSessionFromUrl();
      if (error) {
        console.error("Auth callback error:", error);
        return;
      }

      // 2) set Supabase client to use that session
      await supabase.auth.setSession(data.session);

      // 3) fetch your own account row by email
      const email = data.session.user.email;
      try {
        const accounts = await AJAX(`${API_URL}/accounts`);
        const account = accounts.find((a) => a.email === email);
        if (account) {
          // hydrate front-end user
          const userObj = {
            id: account.id,
            accountType: account.id.startsWith("s-")
              ? "student"
              : "company",
            name_and_surname: account.name_and_surname,
          };
          model.state.user = userObj;
          localStorage.setItem(
            "loggedInUser",
            JSON.stringify(userObj)
          );
        }
      } catch (err) {
        console.error(
          "Error loading account after confirmation:",
          err
        );
      }

      // 4) back to home
      router.replace("/");
    }
    finishAuth();
  }, [router]);

  return <p>Finishing sign-up…</p>;
}
