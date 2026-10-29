/**
 * હોમ સ્ક્રીન (HOME SCREEN - ડેશબોર્ડ લિસ્ટ)
 * -------------------------------------------------------------------------
 * આ સ્ક્રીન ડેશબોર્ડ ડેટાનું લિસ્ટ પ્રદર્શિત કરે છે.
 * 
 * સ્ટેપ બાય સ્ટેપ ફ્લો:
 * ૧. સ્ક્રીન ઓપન થાય ત્યારે 'useEffect()' માંથી 'GetDashboardList(props)' કૉલ થાય છે.
 * ૨. 'dashboard_loading === true' હોય ત્યારે 'Loader' કમ્પોનન્ટ દેખાય છે.
 * ૩. સર્વર પરથી ડેટા આવે ત્યારે 'FlatList' માં કાર્ડ સ્વરૂપે લિસ્ટ દેખાય છે.
 * ૪. કોઈ પણ કાર્ડ પર ક્લિક કરતાં 'DetailsScreen' પર જવાય છે અને કાર્ડનો ડેટા સાથે પાસ થાય છે.
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  RefreshControl,
} from 'react-native';
import colors from '../../utils/colors';
import { useDashboardContext } from '../../Context/Dashboard_context';
import { useProductContext } from '../../Context/Product_context';
import Loader from '../../components/Loader';
import MainHedar from '../../components/MainHedar';

const HomeScreen = (props) => {
  // ગ્લોબલ ડેશબોર્ડ કન્ટેક્સ્ટમાંથી ડેટા અને ફંક્શન્સ લીધા
  const {
    GetDashboardList,
    dashboard_data,
    dashboard_loading,
    ToggleSelectItem,
  } = useDashboardContext();

  // ગ્લોબલ પ્રોડક્ટ કન્ટેક્સ્ટમાંથી ડેટા લીધો (તમારા નવા Product_context માંથી)
  const { product_list, product_list_loading } = useProductContext();

  // સ્ક્રીન પહેલી વાર ખુલે ત્યારે ડેટા લોડ કરો
  useEffect(() => {
    GetDashboardList(props);
  }, []);

  // લિસ્ટમાં દરેક કાર્ડ કેવું દેખાશે તે માટેનું ફંક્શન
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.8}
      onPress={() => props.navigation.navigate('DetailsScreen', { item })}
    >
      <View style={styles.cardHeader}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.category || 'General'}</Text>
        </View>
        <TouchableOpacity
          style={styles.favBtn}
          onPress={() => ToggleSelectItem(item.id, props)}
        >
          <Text style={styles.favIcon}>{item.selected ? '★' : '☆'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.itemTitle}>{item.title}</Text>
      <Text style={styles.itemDesc} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.cardFooter}>
        <Text style={styles.dateText}>📅 {item.date}</Text>
        <Text style={styles.viewMoreText}>View Details →</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <MainHedar
        title="Dashboard"
        showBack={false}
      />
      <StatusBar barStyle="light-content" backgroundColor={colors.themecolor1} />

      {/* જો ડેટા લોડ થઈ રહ્યો હોય તો લોડર બતાવો */}
      {dashboard_loading && dashboard_data.length === 0 ? (
        <View style={styles.loaderCenter}>
          <Loader text="FETCHING DATA..." />
        </View>
      ) : (
        <FlatList
          data={dashboard_data}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.productBanner}>
              <Text style={styles.productBannerTitle}>📦 Product_context Live State:</Text>
              <Text style={styles.productBannerCount}>
                {product_list_loading ? 'Loading...' : `${product_list.length} Products Available in State`}
              </Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={dashboard_loading}
              onRefresh={() => GetDashboardList(props)}
              colors={[colors.themecolor1]}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No items found.</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.whitesmoke,
  },
  loaderCenter: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 90, // નીચેના બોટમ ટેબ બાર માટે જગ્યા
  },
  productBanner: {
    backgroundColor: '#EEF2FF',
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
    borderLeftWidth: 4,
    borderLeftColor: colors.themecolor1,
  },
  productBannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  productBannerCount: {
    fontSize: 12,
    color: colors.themecolor1,
    marginTop: 2,
    fontWeight: '600',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  badge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: colors.themecolor1,
    fontSize: 12,
    fontWeight: '700',
  },
  favBtn: {
    padding: 4,
  },
  favIcon: {
    fontSize: 22,
    color: '#F59E0B',
  },
  itemTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  itemDesc: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
  },
  dateText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  viewMoreText: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.themecolor1,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
    fontSize: 15,
  },
});

export default HomeScreen;
