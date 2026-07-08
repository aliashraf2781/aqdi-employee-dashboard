import AnalysisMetricCard from "./AnalysisMetricCard";

export default function LayeringCard({ item }) {
    return (
        <AnalysisMetricCard
            item={item}
            showIcon={false}
            showViewButton={Boolean(item.link)}
        />
    );
}
