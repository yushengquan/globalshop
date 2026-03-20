package com.globalshop.controller;

import com.globalshop.common.Result;
import com.globalshop.entity.Product;
import com.globalshop.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping("/api/products")
    public Result<?> list(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "12") Integer size,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "bestseller") String sort) {
        return Result.success(productService.list(page, size, categoryId, keyword, sort));
    }

    @GetMapping("/api/products/featured")
    public Result<?> featured(@RequestParam(defaultValue = "8") Integer size) {
        return Result.success(productService.featured(size));
    }

    @GetMapping("/api/products/{id}")
    public Result<?> getById(@PathVariable Long id) {
        return Result.success(productService.getById(id));
    }

    @PostMapping("/api/admin/products")
    public Result<?> create(@RequestBody Product product) {
        return Result.success(productService.create(product));
    }

    @PutMapping("/api/admin/products/{id}")
    public Result<?> update(@PathVariable Long id, @RequestBody Product product) {
        return Result.success(productService.update(id, product));
    }

    @DeleteMapping("/api/admin/products/{id}")
    public Result<?> delete(@PathVariable Long id) {
        productService.delete(id);
        return Result.success();
    }
}
