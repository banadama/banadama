// mobile/screens/SupplierOrders.tsx - React Native Supplier Orders
import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { tokens } from "../tokens";

export function SupplierOrders() {
    const orders = [
        { id: "PO-001", buyer: "Buyer A", status: "IN_PRODUCTION", total: "₦120,000" },
        { id: "PO-002", buyer: "Buyer B", status: "READY", total: "₦85,000" },
        { id: "PO-003", buyer: "Buyer C", status: "PENDING", total: "₦45,000" },
    ];

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "IN_PRODUCTION":
                return <Badge variant="warning">🏭 In Production</Badge>;
            case "READY":
                return <Badge variant="success">✓ Ready</Badge>;
            case "PENDING":
                return <Badge>⏳ Pending</Badge>;
            default:
                return <Badge>{status}</Badge>;
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>📦 Supplier Orders</Text>

            {/* Stats */}
            <View style={styles.statsRow}>
                <Card style={styles.statCard}>
                    <Text style={styles.statLabel}>Active</Text>
                    <Text style={styles.statValue}>{orders.length}</Text>
                </Card>
                <Card style={styles.statCard}>
                    <Text style={styles.statLabel}>This Month</Text>
                    <Text style={[styles.statValue, { color: tokens.success }]}>₦250K</Text>
                </Card>
            </View>

            {/* Orders List */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Current Orders</Text>
                {orders.map((order) => (
                    <Card key={order.id} style={styles.orderCard}>
                        <View style={styles.orderHeader}>
                            <View>
                                <Text style={styles.orderId}>{order.id}</Text>
                                <Text style={styles.orderBuyer}>{order.buyer}</Text>
                            </View>
                            {getStatusBadge(order.status)}
                        </View>
                        <View style={styles.orderFooter}>
                            <Text style={styles.orderTotal}>{order.total}</Text>
                            <Button
                                title="Update Status"
                                variant="primary"
                                size="sm"
                                onPress={() => { }}
                            />
                        </View>
                    </Card>
                ))}
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
    title: {
        fontSize: tokens.fontSize.xl,
        fontWeight: tokens.fontWeight.black,
        color: tokens.fg,
        marginBottom: tokens.spacing.xl,
    },
    statsRow: {
        flexDirection: "row",
        gap: tokens.spacing.md,
        marginBottom: tokens.spacing.xl,
    },
    statCard: {
        flex: 1,
    },
    statLabel: {
        fontSize: tokens.fontSize.sm,
        color: tokens.fg,
        opacity: 0.7,
        fontWeight: tokens.fontWeight.bold,
    },
    statValue: {
        fontSize: tokens.fontSize.xl,
        fontWeight: tokens.fontWeight.black,
        color: tokens.fg,
        marginTop: tokens.spacing.xs,
    },
    section: {
        gap: tokens.spacing.md,
    },
    sectionTitle: {
        fontSize: tokens.fontSize.md,
        fontWeight: tokens.fontWeight.bold,
        color: tokens.fg,
        marginBottom: tokens.spacing.sm,
    },
    orderCard: {
        marginBottom: tokens.spacing.md,
    },
    orderHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: tokens.spacing.md,
    },
    orderId: {
        fontSize: tokens.fontSize.md,
        fontWeight: tokens.fontWeight.bold,
        color: tokens.fg,
    },
    orderBuyer: {
        fontSize: tokens.fontSize.sm,
        color: tokens.fg,
        opacity: 0.6,
        marginTop: 2,
    },
    orderFooter: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    orderTotal: {
        fontSize: tokens.fontSize.md,
        fontWeight: tokens.fontWeight.bold,
        color: tokens.success,
    },
});
