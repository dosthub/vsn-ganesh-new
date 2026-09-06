import { Clock3 } from "lucide-react";
export function Schedule({
  items,
}: {
  items: { day: string; title: string; time: string; description: string }[];
}) {
  return (
    <div className="schedule-grid">
      {items.map((item, i) => (
        <article className="schedule-card" key={item.title}>
          <span className="schedule-number">0{i + 1}</span>
          <span className="eyebrow">{item.day}</span>
          <h3>{item.title}</h3>
          <p>{item.description}</p>
          <div>
            <Clock3 size={15} />
            {item.time}
          </div>
        </article>
      ))}
    </div>
  );
}
