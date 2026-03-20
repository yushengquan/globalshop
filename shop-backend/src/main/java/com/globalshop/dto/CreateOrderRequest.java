package com.globalshop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;
import java.util.List;

@Data
public class CreateOrderRequest {
    @NotBlank private String shippingName;
    @NotBlank private String shippingEmail;
    private String shippingPhone;
    @NotBlank private String shippingAddress;
    @NotBlank private String shippingCity;
    private String shippingState;
    @NotBlank private String shippingZip;
    @NotBlank private String shippingCountry;
    private String couponCode;
    private String paymentMethod;
    @NotEmpty
    private List<OrderItemRequest> items;

    @Data
    public static class OrderItemRequest {
        private Long productId;
        private Integer quantity;
        private String skuInfo;
    }
}
