export const fetchAllEmployees = async () => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/user/view/all`,
    );

    if (!response.ok) {
      throw new Error(`HTTP error: Status ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (err) {
    console.log(err);
  }
};
