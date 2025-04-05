import {
  Grid,
  GridCol,
  Card,
  CardSection,
  Text,
  Image,
  Group,
  Badge,
} from "@mantine/core";
import { FC } from "react";
import { planService } from "@repo/services";
import PlanSubmitButton from "./PlanSubmitButton";

const Plans: FC = async () => {
  const plans = await planService.getPlans();
  return <div>ddd</div>;
};

export default Plans;
