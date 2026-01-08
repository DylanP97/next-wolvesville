export const fetchUsers = async () => {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/user/getAllUsers"
    );
    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  }
};

export const fetchRoles = async () => {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/roles"
    );
    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.error("Error fetching roles:", error);
  }
};

export const fetchTeams = async () => {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/teams"
    );
    if (response.ok) {
      return response.json();
    } else {
      console.error("Failed to fetch teams");
    }
  } catch (error) {
    console.error("Error fetching teams:", error);
  }
};

export const fetchTeamByName = async (name) => {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + `/api/teams/${name}`
    );
    if (response.ok) {
      return response.json();
    } else {
      console.error("Failed to fetch the team");
    }
  } catch (error) {
    console.error("Error fetching teams:", error);
  }
};

export const fetchLogout = async (username, isGuest) => {
  try {
    return await fetch(process.env.NEXT_PUBLIC_API_URL + "/api/user/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Add this header
      },
      credentials: "include",
      body: JSON.stringify({ username, isGuest }),
    });
  } catch (error) {
    console.error("Logout error:", error);
  }
};

export const fetchLogin = async (email, password) => {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/user/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // Handle specific error messages from backend
      if (data.error) {

        // Map backend errors to user-friendly messages
        if (data.error === "incorrect email" || data.error === "no user found") {
          return { error: "No account found with this email" };
        }
        if (data.error === "incorrect password") {
          return { error: "Incorrect password. Please try again." };
        }
        return { error: data.error };
      }

      // Fallback for status codes without specific error message
      if (response.status === 401) {
        return { error: "Invalid email or password" };
      }

      return { error: data.message || "Login failed. Please try again." };
    }

    return data;
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Unable to connect to server. Please try again." };
  }
};

export const fetchGuestLogin = async () => {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/user/guestLogin",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    );
    if (response.ok) {
      return response.json();
    }
  } catch (error) {
    console.error("Login error:", error);
  }
};

export const fetchSignUp = async (username, email, password, defaultAvatar) => {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/user/signup",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, defaultAvatar }),
        credentials: "include",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // Handle errors object from backend
      if (data.errors && typeof data.errors === 'object') {
        // Convert errors object to a user-friendly message
        const errorMessages = [];
        if (data.errors.password) errorMessages.push(data.errors.password);
        if (data.errors.email) errorMessages.push(data.errors.email);
        if (data.errors.general) errorMessages.push(data.errors.general);

        return { error: errorMessages.join('. ') || "Signup failed" };
      }

      return { error: data.message || "Signup failed" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Signup error:", error);
    return { error: "Unable to connect to server. Please try again." };
  }
};