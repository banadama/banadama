// mobile/screens/BuyerMarketplace.tsx - React Native Buyer Marketplace
import React, { useState } from "react";
import { View, Text, ScrollView, TextInput, StyleSheet } from "react-native";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { tokens } from "../tokens";

export function BuyerMarketplace() {
    const [searchQuery, setSearchQuery] = useState("");

    const products = [
        { id: "p1", title: "Packaging Nylon Bags", price: "₦3,500", moq: 100, country: "NG", verified: true },
        { id: "p2", title: "BD T-Shirt Bulk", price: "$1.20", moq: 300, country: "BD", verified: true },
        { id: "p3", title: "Carton Boxes", price: "₦25,000", moq: 50, country: "NG", verified: false },
    ];

    const filteredProducts = products.filter((p) =>
        p.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>🛒 Marketplace</Text>

            {/* Search */}
            <TextInput
                style={styles.searchInput}
                placeholder="Search products..."
                placeholderTextColor={tokens.border}
                value={searchQuery}
                onChangeText={setSearchQuery}
            />

            {/* Filters */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
                <Badge>All</Badge>
                <Badge>🇳🇬 Nigeria</Badge>
                <Badge>🇧🇩 Bangladesh</Badge>
                <Badge>Packaging</Badge>
                <Badge>Fashion</Badge>
            </ScrollView>

            {/* Products */}
            <ScrollView style={styles.productList}>
                {filteredProducts.map((product) => (
                    <Card key={product.id} style={styles.productCard}>
                        <View style={styles.productHeader}>
                            <Text style={styles.productTitle}>{product.title}</Text>
                            {product.verified && <Badge variant="success">✓</Badge>}
                        </View>

                        <View style={styles.productInfo}>
                            <Text style={styles.productPrice}>{product.price} / unit</Text>
                            <Text style={styles.productMoq}>MOQ: {product.moq}</Text>
                        </View>

                        <View style={styles.productCountry}>
                            <Badge>{product.country === "NG" ? "🇳🇬" : "🇧🇩"}</Badge>
                        </View>

                        <View style={styles.productActions}>
                            <Button
                                title="Buy Now"
                                variant="primary"
                                onPress={() => { }}
                                style={{ flex: 1 }}
                            />
                            <Button
                                title="RFQ"
                                onPress={() => { }}
                                style={{ flex: 1 }}
                            />
                        </View>
                    </Card>
                ))}
            </ScrollView>
        </View>
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
        marginBottom: tokens.spacing.lg,
    },
    searchInput: {
        backgroundColor: tokens.bg,
        borderWidth: 1,
        borderColor: tokens.border,
        borderRadius: tokens.radius.md,
        padding: tokens.spacing.md,
        fontSize: tokens.fontSize.md,
        color: tokens.fg,
        marginBottom: tokens.spacing.md,
    },
    filters: {
        flexDirection: "row",
        marginBottom: tokens.spacing.lg,
        maxHeight: 40,
    },
    productList: {
        flex: 1,
    },
    productCard: {
        marginBottom: tokens.spacing.md,
    },
    productHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: tokens.spacing.sm,
    },
    productTitle: {
        fontSize: tokens.fontSize.md,
        fontWeight: tokens.fontWeight.bold,
        color: tokens.fg,
        flex: 1,
    },
    productInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: tokens.spacing.sm,
    },
    productPrice: {
        fontSize: tokens.fontSize.md,
        fontWeight: tokens.fontWeight.bold,
        color: tokens.fg,
    },
    productMoq: {
        fontSize: tokens.fontSize.sm,
        color: tokens.fg,
        opacity: 0.6,
    },
    productCountry: {
        marginBottom: tokens.spacing.md,
    },
    productActions: {
        flexDirection: "row",
        gap: tokens.spacing.md,
    },
});
