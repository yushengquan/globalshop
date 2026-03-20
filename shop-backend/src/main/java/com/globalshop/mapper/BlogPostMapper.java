package com.globalshop.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.globalshop.entity.BlogPost;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface BlogPostMapper extends BaseMapper<BlogPost> {
    @Select("SELECT * FROM blog_posts WHERE status = 1 ORDER BY created_at DESC LIMIT #{size}")
    java.util.List<BlogPost> findPublished(int size);

    @Select("SELECT * FROM blog_posts WHERE slug = #{slug} AND status = 1")
    BlogPost findBySlug(String slug);
}
