// mobile/screens/OpsDashboard.tsx - React Native Ops Dashboard
import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { tokens } from "../tokens";

export function OpsDashboard() {
    const stats = {
        rfqQueue: 2,
        quotesToday: 5,
        activeOrders: 3,
        delayed: 0,
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>🎯 Ops Dashboard</Text>
                <Badge variant="success">LIVE</Badge>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
                <Card style={styles.statCard}>
                    <Text style={styles.statLabel}>RFQ Queue</Text>
                    <Text style={[styles.statValue, { color: tokens.warning }]}>
                        {stats.rfqQueue}
                    </Text>
                </Card>
                <Card style={styles.statCard}>
                    <Text style={styles.statLabel}>Quotes Today</Text>
                    <Text style={styles.statValue}>{stats.quotesToday}</Text>
                </Card>
                <Card style={styles.statCard}>
                    <Text style={styles.statLabel}>Active Orders</Text>
                    <Text style={styles.statValue}>{stats.activeOrders}</Text>
                </Card>
                <Card style={styles.statCard}>
                    <Text style={styles.statLabel}>Delayed</Text>
                    <Text style={[styles.statValue, { color: tokens.danger }]}>
                        {stats.delayed}
                    </Text>
                </Card>
            </View>

            {/* Quick Actions */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actions}>
                    <Button title="📋 Open RFQs" variant="primary" onPress={() => { }} />
                    <Button title="🚚 Logistics" onPress={() => { }} />
                    <Button title="💬 Messages" onPress={() => { }} />
                </View>
            </View>

            {/* Pending RFQs */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Pending RFQs</Text>
                <Card>
                    <View style={styles.listItem}>
                        <View>
                            <Text style={styles.itemTitle}>RFQ-100</Text>
                            <Text style={styles.itemSubtitle}>Buyer A • Nylon Bags</Text>
                        </View>
                        <Badge variant="warning">PENDING</Badge>
                    </View>
                </Card>
                <Card>
                    <View style={styles.listItem}>
                        <View>
                            <Text style={styles.itemTitle}>RFQ-101</Text>
                            <Text style={styles.itemSubtitle}>Buyer B • T-Shirts</Text>
                        </View>
                        <Badge variant="warning">PENDING</Badge>
                    </View>
                </Card>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: tokens.muted,
        padding: tokens.spacing.lg,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: tokens.spacing.xl,
    },
    title: {
        fontSize: tokens.fontSize.xl,
        fontWeight: tokens.fontWeight.black,
        color: tokens.fg,
    },
    statsGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: tokens.spacing.md,
        marginBottom: tokens.spacing.xl,
    },
    statCard: {
        flex: 1,
        minWidth: "45%",
    },
    statLabel: {
        fontSize: tokens.fontSize.sm,
        color: tokens.fg,
        opacity: 0.7,
        fontWeight: tokens.fontWeight.bold,
    },
    statValue: {
        fontSize: tokens.fontSize.xxl,
        fontWeight: tokens.fontWeight.black,
        color: tokens.fg,
        marginTop: tokens.spacing.xs,
    },
    section: {
        marginBottom: tokens.spacing.xl,
    },
    sectionTitle: {
        fontSize: tokens.fontSize.md,
        fontWeight: tokens.fontWeight.bold,
        color: tokens.fg,
        marginBottom: tokens.spacing.md,
    },
    actions: {
        gap: tokens.spacing.md,
    },
    listItem: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    itemTitle: {
        fontSize: tokens.fontSize.md,
        fontWeight: tokens.fontWeight.bold,
        color: tokens.fg,
    },
    itemSubtitle: {
        fontSize: tokens.fontSize.sm,
        color: tokens.fg,
        opacity: 0.6,
        marginTop: 2,
    },
});
