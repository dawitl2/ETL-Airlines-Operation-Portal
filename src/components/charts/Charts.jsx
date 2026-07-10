'use client'

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const colors = ['#007a55', '#f3b700', '#d82a32', '#4f7f9f', '#6b7280', '#374151']

export function LoginActivityChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="day" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="success" stroke="#007a55" strokeWidth={2} />
        <Line type="monotone" dataKey="failed" stroke="#d82a32" strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export function DistributionChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Tooltip />
        <Legend />
        <Pie data={data} dataKey="value" nameKey="name" outerRadius={88}>
          {data.map((entry, index) => (
            <Cell fill={colors[index % colors.length]} key={entry.name} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}

export function FlightStatusChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="scheduled" fill="#007a55" />
        <Bar dataKey="delayed" fill="#d82a32" />
      </BarChart>
    </ResponsiveContainer>
  )
}

export function DemandChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="label" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Area dataKey="demand" fill="#f3b700" stroke="#b98500" />
        <Area dataKey="available" fill="#007a55" stroke="#007a55" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
