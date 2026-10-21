import * as React from "react";

export const useFetchUID = () => {
  const [UIDs, setUIDs] = React.useState<UID[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchAllUID = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/uid-master/view/all`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error: Status ${response.status}`);
      }

      const result = await response.json();
      setUIDs(result.uids);
      console.log(result.uids);
    } catch (err) {
      setUIDs([]);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchAllUID();
  }, []);

  return { UIDs, loading, fetchAllUID, setLoading };
};
