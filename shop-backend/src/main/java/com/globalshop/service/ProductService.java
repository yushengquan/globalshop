package com.globalshop.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.globalshop.common.PageResult;
import com.globalshop.entity.Product;
import com.globalshop.mapper.ProductMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductMapper productMapper;

    public PageResult<Product> list(Integer page, Integer size, Long categoryId, String keyword, String sort) {
        LambdaQueryWrapper<Product> qw = new LambdaQueryWrapper<>();
        qw.eq(Product::getStatus, "ACTIVE");
        if (categoryId != null) qw.eq(Product::getCategoryId, categoryId);
        if (StringUtils.hasText(keyword)) {
            qw.like(Product::getName, keyword).or().like(Product::getDescription, keyword);
        }
        if ("price_asc".equals(sort)) qw.orderByAsc(Product::getPrice);
        else if ("price_desc".equals(sort)) qw.orderByDesc(Product::getPrice);
        else if ("newest".equals(sort)) qw.orderByDesc(Product::getCreatedAt);
        else qw.orderByDesc(Product::getSoldCount);

        Page<Product> p = productMapper.selectPage(new Page<>(page, size), qw);
        return PageResult.of(p.getRecords(), p.getTotal(), p.getCurrent(), p.getSize());
    }

    public Product getById(Long id) {
        Product p = productMapper.selectById(id);
        if (p == null) throw new RuntimeException("Product not found");
        return p;
    }

    public Product create(Product product) {
        product.setStatus("ACTIVE");
        product.setSoldCount(0);
        productMapper.insert(product);
        return product;
    }

    public Product update(Long id, Product product) {
        product.setId(id);
        productMapper.updateById(product);
        return productMapper.selectById(id);
    }

    public void delete(Long id) {
        productMapper.deleteById(id);
    }

    public PageResult<Product> featured(Integer size) {
        LambdaQueryWrapper<Product> qw = new LambdaQueryWrapper<>();
        qw.eq(Product::getStatus, "ACTIVE").eq(Product::getFeatured, true).orderByDesc(Product::getSoldCount);
        Page<Product> p = productMapper.selectPage(new Page<>(1, size), qw);
        return PageResult.of(p.getRecords(), p.getTotal(), 1L, (long) size);
    }
}
