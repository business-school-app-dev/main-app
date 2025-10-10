import { EventCard } from "./EventCard";

export function EventsSection() {
  const events = [
    {
      title: "Financial Planning Workshop",
      date: "Nov 15",
      detail: "Learn budgeting basics and investment strategies"
    },
    {
      title: "Career & Finance Fair",
      date: "Nov 22",
      detail: "Meet employers and financial advisors"
    },
    {
      title: "Student Loan Information Session",
      date: "Dec 1",
      detail: "Understanding repayment options and forgiveness programs"
    },
    {
      title: "Tax Preparation Workshop",
      date: "Dec 8",
      detail: "Free tax prep assistance for students"
    }
  ];

  return (
    <div className="w-full py-6">
      <div className="px-6 mb-4">
        <h2 className="text-xl font-semibold text-black">
          Upcoming Campus Events
        </h2>
      </div>
      
      <div className="overflow-x-auto">
        <div className="flex space-x-4 px-6 pb-2">
          {events.map((event, index) => (
            <EventCard
              key={index}
              title={event.title}
              date={event.date}
              detail={event.detail}
              onPress={() => console.log(`${event.title} pressed`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}