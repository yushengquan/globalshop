package com.globalshop.controller;

import com.globalshop.common.Result;
import com.globalshop.mapper.OrderMapper;
import com.globalshop.entity.Order;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final OrderMapper orderMapper;

    // Mock Stripe checkout - returns fake payment intent
    @PostMapping("/stripe/checkout")
    public Result<?> stripeCheckout(@RequestBody Map<String, Object> body) {
        String orderId = String.valueOf(body.get("orderId"));
        String mockPaymentId = "pi_mock_" + UUID.randomUUID().toString().replace("-", "");
        // In production: create real Stripe PaymentIntent here
        return Result.success(Map.of(
                "clientSecret", mockPaymentId + "_secret_mock",
                "paymentIntentId", mockPaymentId,
                "status", "requires_payment_method"
        ));
    }

    // Mock payment success callback
    @PostMapping("/stripe/confirm")
    public Result<?> stripeConfirm(@RequestBody Map<String, Object> body) {
        Long orderId = Long.parseLong(String.valueOf(body.get("orderId")));
        Order order = orderMapper.selectById(orderId);
        if (order != null) {
            order.setStatus("PAID");
            order.setPaymentId(String.valueOf(body.get("paymentIntentId")));
            orderMapper.updateById(order);
        }
        return Result.success(Map.of("status", "PAID", "orderId", String.valueOf(orderId)));
    }
}
