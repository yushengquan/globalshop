package com.globalshop.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.globalshop.common.PageResult;
import com.globalshop.dto.CreateOrderRequest;
import com.globalshop.entity.Order;
import com.globalshop.entity.OrderItem;
import com.globalshop.entity.Product;
import com.globalshop.mapper.OrderItemMapper;
import com.globalshop.mapper.OrderMapper;
import com.globalshop.mapper.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderMapper orderMapper;
    private final OrderItemMapper orderItemMapper;
    private final ProductMapper productMapper;

    @Transactional
    public Order create(Long userId, CreateOrderRequest req) {
        Order order = new Order();
        order.setOrderNo("GS" + DateTimeFormatter.ofPattern("yyyyMMddHHmmss").format(LocalDateTime.now())
                + UUID.randomUUID().toString().substring(0, 6).toUpperCase());
        order.setUserId(userId);
        order.setStatus("PENDING");
        order.setCurrency("USD");
        order.setShippingName(req.getShippingName());
        order.setShippingEmail(req.getShippingEmail());
        order.setShippingPhone(req.getShippingPhone());
        order.setShippingAddress(req.getShippingAddress());
        order.setShippingCity(req.getShippingCity());
        order.setShippingState(req.getShippingState());
        order.setShippingZip(req.getShippingZip());
        order.setShippingCountry(req.getShippingCountry());
        order.setCouponCode(req.getCouponCode());
        order.setPaymentMethod(req.getPaymentMethod() != null ? req.getPaymentMethod() : "STRIPE");

        BigDecimal subtotal = BigDecimal.ZERO;
        List<OrderItem> items = new ArrayList<>();
        for (CreateOrderRequest.OrderItemRequest itemReq : req.getItems()) {
            Product p = productMapper.selectById(itemReq.getProductId());
            if (p == null) throw new RuntimeException("Product not found: " + itemReq.getProductId());
            OrderItem item = new OrderItem();
            item.setProductId(p.getId());
            item.setProductName(p.getName());
            item.setProductImage(p.getMainImage());
            item.setSkuInfo(itemReq.getSkuInfo());
            item.setPrice(p.getPrice());
            item.setQuantity(itemReq.getQuantity());
            item.setSubtotal(p.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity())));
            subtotal = subtotal.add(item.getSubtotal());
            items.add(item);
        }

        BigDecimal shippingFee = subtotal.compareTo(new BigDecimal("50")) >= 0 ? BigDecimal.ZERO : new BigDecimal("9.99");
        order.setSubtotal(subtotal);
        order.setShippingFee(shippingFee);
        order.setDiscount(BigDecimal.ZERO);
        order.setTotal(subtotal.add(shippingFee));
        orderMapper.insert(order);

        for (OrderItem item : items) {
            item.setOrderId(order.getId());
            orderItemMapper.insert(item);
        }
        return order;
    }

    public Map<String, Object> getDetail(Long orderId) {
        Order order = orderMapper.selectById(orderId);
        if (order == null) throw new RuntimeException("Order not found");
        List<OrderItem> items = orderItemMapper.findByOrderId(orderId);
        return Map.of("order", order, "items", items);
    }

    public PageResult<Order> getUserOrders(Long userId, Integer page, Integer size) {
        LambdaQueryWrapper<Order> qw = new LambdaQueryWrapper<>();
        qw.eq(Order::getUserId, userId).orderByDesc(Order::getCreatedAt);
        Page<Order> p = orderMapper.selectPage(new Page<>(page, size), qw);
        return PageResult.of(p.getRecords(), p.getTotal(), p.getCurrent(), p.getSize());
    }

    public Order updateStatus(Long orderId, String status) {
        Order order = orderMapper.selectById(orderId);
        if (order == null) throw new RuntimeException("Order not found");
        order.setStatus(status);
        orderMapper.updateById(order);
        return order;
    }

    public PageResult<Order> adminList(Integer page, Integer size, String status) {
        LambdaQueryWrapper<Order> qw = new LambdaQueryWrapper<>();
        if (status != null) qw.eq(Order::getStatus, status);
        qw.orderByDesc(Order::getCreatedAt);
        Page<Order> p = orderMapper.selectPage(new Page<>(page, size), qw);
        return PageResult.of(p.getRecords(), p.getTotal(), p.getCurrent(), p.getSize());
    }
}
