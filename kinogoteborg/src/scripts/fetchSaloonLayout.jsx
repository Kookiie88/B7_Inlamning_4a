export async function fetchSaloon(saloonNumber) {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    saloon: saloonNumber,
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  // Return the Promise chain
  return fetch("http://localhost:3000/api/booking", requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      // console.log("result from fetschSaloon: ");
      return response.json();
    })
    .catch((error) => {
      console.error("Error fetching saloon data:", error);
      throw error; // Re-throw the error to handle it elsewhere
    });
}
