package com.globalshop.controller;

import com.globalshop.common.Result;
import com.globalshop.entity.Category;
import com.globalshop.mapper.CategoryMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryMapper categoryMapper;

    @GetMapping
    public Result<List<Category>> list() {
        return Result.success(categoryMapper.selectList(null));
    }

    @PostMapping
    public Result<Category> create(@RequestBody Category category) {
        categoryMapper.insert(category);
        return Result.success(category);
    }
}
