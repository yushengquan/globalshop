package com.globalshop.controller;

import com.globalshop.common.Result;
import com.globalshop.entity.BlogPost;
import com.globalshop.mapper.BlogPostMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class BlogController {
    private final BlogPostMapper blogPostMapper;

    @GetMapping("/api/blog")
    public Result<List<BlogPost>> list(@RequestParam(defaultValue = "10") int size) {
        return Result.success(blogPostMapper.findPublished(size));
    }

    @GetMapping("/api/blog/{slug}")
    public Result<BlogPost> getBySlug(@PathVariable String slug) {
        BlogPost post = blogPostMapper.findBySlug(slug);
        if (post == null) return Result.error(404, "Post not found");
        post.setViewCount((post.getViewCount() == null ? 0 : post.getViewCount()) + 1);
        blogPostMapper.updateById(post);
        return Result.success(post);
    }

    @GetMapping("/api/admin/blog")
    public Result<List<BlogPost>> adminList() {
        return Result.success(blogPostMapper.selectList(null));
    }

    @PostMapping("/api/admin/blog")
    public Result<BlogPost> create(@RequestBody BlogPost post) {
        blogPostMapper.insert(post);
        return Result.success(post);
    }

    @PutMapping("/api/admin/blog/{id}")
    public Result<BlogPost> update(@PathVariable Long id, @RequestBody BlogPost post) {
        post.setId(id);
        blogPostMapper.updateById(post);
        return Result.success(post);
    }

    @DeleteMapping("/api/admin/blog/{id}")
    public Result<?> delete(@PathVariable Long id) {
        blogPostMapper.deleteById(id);
        return Result.success();
    }
}
