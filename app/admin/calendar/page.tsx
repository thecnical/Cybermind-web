import Breadcrumb from "@/components/admin-ui/Breadcrumbs/Breadcrumb";
import CalendarBox from "@/components/admin-ui/CalenderBox";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calender Page",
  // other metadata
};

const CalendarPage = () => {
  return (
    <>
      <Breadcrumb pageName="Calendar" />

      <CalendarBox />
    </>
  );
};

export default CalendarPage;
