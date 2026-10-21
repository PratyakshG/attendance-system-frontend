import * as React from "react";

export const useFetchEmployees = () => {
  const [employees, setEmployees] = React.useState<ServerEmployee[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/user/view/all`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error: Status ${response.status}`);
      }

      const result = await response.json();
      setEmployees(result.data);
      // console.log(result.data);
    } catch (err) {
      setEmployees([]);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchEmployees();
  }, []);

  return { employees, loading, fetchEmployees, setLoading };
};
