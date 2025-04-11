"use client";
import { Card, Flex, Typography, Button } from "antd";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { useState } from "react";

const { Text } = Typography;

interface ChartData {
  month: string;
  attendance: number;
  members: number;
  events: number;
  lastYearAttendance: number;
  lastYearMembers: number;
  lastYearEvents: number;
}

const allData: ChartData[] = [
  { month: "Jan", attendance: 10, members: 150, events: 5, lastYearAttendance: 5, lastYearMembers: 120, lastYearEvents: 3 },
  { month: "Feb", attendance: 8, members: 145, events: 7, lastYearAttendance: 15, lastYearMembers: 125, lastYearEvents: 6 },
  { month: "Mar", attendance: 15, members: 160, events: 10, lastYearAttendance: 50, lastYearMembers: 140, lastYearEvents: 8 },
  { month: "Apr", attendance: 40, members: 180, events: 12, lastYearAttendance: 10, lastYearMembers: 150, lastYearEvents: 10 },
  { month: "May", attendance: 60, members: 200, events: 15, lastYearAttendance: 30, lastYearMembers: 170, lastYearEvents: 12 },
  { month: "Jun", attendance: 45, members: 190, events: 18, lastYearAttendance: 60, lastYearMembers: 180, lastYearEvents: 15 },
  { month: "Jul", attendance: 55, members: 210, events: 20, lastYearAttendance: 90, lastYearMembers: 200, lastYearEvents: 18 },
  { month: "Aug", attendance: 70, members: 220, events: 22, lastYearAttendance: 40, lastYearMembers: 190, lastYearEvents: 20 },
  { month: "Sep", attendance: 65, members: 230, events: 25, lastYearAttendance: 75, lastYearMembers: 210, lastYearEvents: 22 },
  { month: "Oct", attendance: 80, members: 240, events: 28, lastYearAttendance: 50, lastYearMembers: 220, lastYearEvents: 25 },
  { month: "Nov", attendance: 75, members: 235, events: 30, lastYearAttendance: 85, lastYearMembers: 230, lastYearEvents: 28 },
  { month: "Dec", attendance: 90, members: 250, events: 35, lastYearAttendance: 60, lastYearMembers: 240, lastYearEvents: 30 },
];

const AttendanceOverview = () => {
  const [visibleMonths, setVisibleMonths] = useState(6);
  const [startIndex, setStartIndex] = useState(0);
  const [activeView, setActiveView] = useState<"attendance" | "members" | "events">("attendance");
  const [activeYear, setActiveYear] = useState<"thisYear" | "lastYear">("thisYear");

  const visibleData = allData.slice(startIndex, startIndex + visibleMonths);

  const handlePrev = () => setStartIndex((prev) => Math.max(0, prev - 1));
  const handleNext = () => setStartIndex((prev) => Math.min(allData.length - visibleMonths, prev + 1));

  const getDataKey = () => {
    const dataKeys = {
      attendance: activeYear === "thisYear" ? "attendance" : "lastYearAttendance",
      members: activeYear === "thisYear" ? "members" : "lastYearMembers",
      events: activeYear === "thisYear" ? "events" : "lastYearEvents",
    };
    return dataKeys[activeView];
  };

  const getColor = () => {
    const colors = {
      attendance: activeYear === "thisYear" ? "#4A5568" : "#3182CE",
      members: activeYear === "thisYear" ? "#38A169" : "#2C7A7B",
      events: activeYear === "thisYear" ? "#D69E2E" : "#B7791F",
    };
    return colors[activeView];
  };

  const getGradientId = () => {
    const gradients = {
      attendance: activeYear === "thisYear" ? "colorAttendance" : "colorLastYearAttendance",
      members: activeYear === "thisYear" ? "colorMembers" : "colorLastYearMembers",
      events: activeYear === "thisYear" ? "colorEvents" : "colorLastYearEvents",
    };
    return gradients[activeView];
  };

  const getYAxisDomain = () => {
    const currentDataKey = getDataKey();
    const values = visibleData.map(item => item[currentDataKey]);
    const maxValue = Math.max(...values);
    return [0, maxValue * 1.2]; // Add 20% padding
  };

  return (
    <Card
      style={{
        borderRadius: 16,
        border: "2px solid #E2E8F0",
        padding: "28px 56px 28px 46px",
        width: "100%",
        maxWidth: 550,
        height: 420,
        margin: 16,
      }}
      bodyStyle={{ padding: 0, height: "100%" }}
    >
      <Flex justify="space-between" style={{ marginBottom: 13 }} align="center">
        <Flex gap={24} align="center">
          <Text
            style={{
              color: activeView === "attendance" ? "#003087" : "#A0AEC0",
              fontFamily: "Lexend, sans-serif",
              fontSize: 15,
              fontWeight: 600,
              lineHeight: "18px",
              cursor: "pointer",
              textDecoration: activeView === "attendance" ? "underline" : "none",
              textDecorationColor: "#003087",
              textUnderlineOffset: "4px",
            }}
            onClick={() => setActiveView("attendance")}
          >
            Attendance Overview
          </Text>
          
          <Text
            style={{
              color: activeView === "members" ? "#003087" : "#A0AEC0",
              fontFamily: "Lexend, sans-serif",
              fontSize: 15,
              fontWeight: 600,
              lineHeight: "18px",
              cursor: "pointer",
              textDecoration: activeView === "members" ? "underline" : "none",
              textDecorationColor: "#003087",
              textUnderlineOffset: "4px",
            }}
            onClick={() => setActiveView("members")}
          >
            Total Members
          </Text>

          <Text
            style={{
              color: activeView === "events" ? "#003087" : "#A0AEC0",
              fontFamily: "Lexend, sans-serif",
              fontSize: 15,
              fontWeight: 600,
              lineHeight: "18px",
              cursor: "pointer",
              textDecoration: activeView === "events" ? "underline" : "none",
              textDecorationColor: "#003087",
              textUnderlineOffset: "4px",
            }}
            onClick={() => setActiveView("events")}
          >
            Total Event
          </Text>
        </Flex>

        <Flex gap={12} align="center">
          <Button
            type={activeYear === "thisYear" ? "primary" : "text"}
            size="small"
            onClick={() => setActiveYear("thisYear")}
            style={{
              fontFamily: "Lexend, sans-serif",
              fontSize: 14,
              background: activeYear === "thisYear" ? "#4A5568" : "transparent",
              color: activeYear === "thisYear" ? "white" : "#718096",
            }}
          >
            This year
          </Button>
          <Button
            type={activeYear === "lastYear" ? "primary" : "text"}
            size="small"
            onClick={() => setActiveYear("lastYear")}
            style={{
              fontFamily: "Lexend, sans-serif",
              fontSize: 14,
              background: activeYear === "lastYear" ? "#3182CE" : "transparent",
              color: activeYear === "lastYear" ? "white" : "#718096",
            }}
          >
            Last year
          </Button>
        </Flex>
      </Flex>

      <div style={{ height: 280, width: "100%", position: "relative" }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={visibleData}
            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorAttendance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4A5568" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#4A5568" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorLastYearAttendance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3182CE" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#3182CE" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38A169" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#38A169" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorLastYearMembers" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2C7A7B" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#2C7A7B" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorEvents" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#D69E2E" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#D69E2E" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorLastYearEvents" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#B7791F" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#B7791F" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              stroke="#E2E8F0"
              strokeDasharray="3 3"
              horizontal={true}
              vertical={false}
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#718096", fontSize: 12 }}
              tickMargin={10}
              interval={0}
            />

            <YAxis 
              hide 
              domain={getYAxisDomain}
            />

            <Tooltip 
              contentStyle={{
                background: "#fff",
                border: "1px solid #E2E8F0",
                borderRadius: 8,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.05)",
              }}
              itemStyle={{
                color: "#4A5568",
                fontFamily: "Lexend, sans-serif",
              }}
              labelStyle={{
                fontWeight: 600,
                color: "#2D3748",
                fontFamily: "Lexend, sans-serif",
              }}
            />

            <Area
              type="monotone"
              dataKey={getDataKey()}
              stroke={getColor()}
              strokeWidth={2.5}
              fillOpacity={1}
              fill={`url(#${getGradientId()})`}
              activeDot={{
                r: 6,
                stroke: getColor(),
                strokeWidth: 2,
                fill: "#fff",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>

        <Flex justify="space-between" style={{ position: "absolute", top: "50%", width: "100%" }}>
          <Button
            shape="circle"
            icon={<LeftOutlined />}
            size="small"
            onClick={handlePrev}
            disabled={startIndex === 0}
            style={{ 
              visibility: startIndex === 0 ? "hidden" : "visible",
              background: "#fff",
              border: "1px solid #E2E8F0",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
            }}
          />
          <Button
            shape="circle"
            icon={<RightOutlined />}
            size="small"
            onClick={handleNext}
            disabled={startIndex >= allData.length - visibleMonths}
            style={{ 
              visibility: startIndex >= allData.length - visibleMonths ? "hidden" : "visible",
              background: "#fff",
              border: "1px solid #E2E8F0",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.05)",
            }}
          />
        </Flex>
      </div>
    </Card>
  );
};

export default AttendanceOverview;