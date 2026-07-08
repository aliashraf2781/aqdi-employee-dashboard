import employeeIcon from "@/public/images/employeeicon.svg";
import dollarIcon from "@/public/images/dollarIcon.svg";
import AnalysisMetricCard from "./AnalysisMetricCard";

export default function AnalsCard({ item }) {
    const icon = item.valueType === "price" ? dollarIcon : employeeIcon;
    return (
        <AnalysisMetricCard
            item={item}
            icon={icon}
            iconSize={item.valueType === "price" ? 16 : 18}
            showViewButton={Boolean(item.link)}
        />
    );
}
