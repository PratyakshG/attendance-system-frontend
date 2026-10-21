import * as React from "react";

export const useFetchNoticeBoard = () => {
  const [notices, setNotices] = React.useState<Notice[]>([]);
  const [loading, setLoading] = React.useState(true);

  const fetchNoticeBoard = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/notice`,
      );

      if (!response.ok) {
        throw new Error(`HTTP error: Status ${response.status}`);
      }

      const result = await response.json();
      setNotices(result.notices);
      console.log(result.notices);
    } catch (err) {
      setNotices([]);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchNoticeBoard();
  }, []);

  return { notices, loading, fetchNoticeBoard, setLoading };
};
