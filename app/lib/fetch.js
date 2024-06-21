const fetchTeams = async () => {
  try {
    const response = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/api/teams"
    );
    if (response.ok) {
      const teamsData = await response.json();
      return teamsData
    } else {
      console.error("Failed to fetch teams");
    }
  } catch (error) {
    console.error("Error fetching teams:", error);
  }
};

export default fetchTeams;
